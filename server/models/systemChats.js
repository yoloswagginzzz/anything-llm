const prisma = require("../utils/prisma");

const SystemChats = {
  getChats: async function (offset = 0, limit = 20) {
    try {
      const result = await prisma.$queryRaw`
        SELECT * FROM (
          SELECT
            id,
            workspaceId,
            prompt,
            response,
            createdAt,
            'workspace' as type,
            (SELECT name FROM workspaces WHERE id = workspaceId) as workspace_name,
            (SELECT username FROM users WHERE id = user_id) as sent_by
          FROM workspace_chats
          UNION ALL
          SELECT
            id,
            embed_id as workspaceId,
            prompt,
            response,
            createdAt,
            'embed' as type,
            (SELECT name FROM workspaces WHERE id = (SELECT workspace_id FROM embed_configs WHERE id = embed_id)) as workspace_name,
            NULL as sent_by
          FROM embed_chats
        ) AS combined_chats
        ORDER BY createdAt DESC
        LIMIT ${limit}
        OFFSET ${offset * limit}
      `;

      const totalChats = await prisma.$queryRaw`
        SELECT
          (SELECT COUNT(*) FROM workspace_chats) +
          (SELECT COUNT(*) FROM embed_chats) as total
      `;

      const hasPages = Number(totalChats[0].total) > (offset + 1) * limit;

      const serializedResult = result.map(chat => ({
        ...chat,
        id: Number(chat.id),
        workspaceId: Number(chat.workspaceId),
        createdAt: chat.createdAt.toISOString(),
      }));

      return {
        chats: serializedResult,
        hasPages,
        totalChats: Number(totalChats[0].total),
      };
    } catch (error) {
      console.error(error.message);
      return { chats: [], hasPages: false, totalChats: 0 };
    }
  },
};

module.exports = { SystemChats };