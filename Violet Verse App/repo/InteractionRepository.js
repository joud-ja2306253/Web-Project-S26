import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class InteractionRepository {

  // GET comments
  async getComments(postId) {
    return prisma.comment.findMany({
      where: { postId: Number(postId) }
    });
  }

  // ADD comment
  async addComment(data) {
    return prisma.comment.create({
      data: {
        content: data.comment,
        postId: Number(data.postId),
        userId: Number(data.userId)
      }
    });
  }

  // DELETE comment
  async deleteComment(id) {
    try {
      await prisma.comment.delete({
        where: { id: Number(id) }
      });
      return true;
    } catch {
      return false;
    }
  }

  // UPDATE comment
  async updateComment(id, data) {
    return prisma.comment.update({
      where: { id: Number(id) },
      data: {
        content: data.comment
      }
    });
  }

}

export default new InteractionRepository();