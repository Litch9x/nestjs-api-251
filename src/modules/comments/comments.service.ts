import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments, CommentsDocument } from 'src/entities/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private commentsModel: Model<CommentsDocument>,
  ) {}

  async getCommentsByProductId(
    page: number,
    limit: number,
    product_id?: string,
  ): Promise<{
    data: Comments[];
    pages: {
      total: number;
      currentPage: number;
      hasNext: boolean;
      hasPrev: boolean;
      next: number;
      prev: number;
    };
  }> {
    const query: {
      product_id?: string;
    } = {};

    if (product_id) {
      query.product_id = product_id;
    }
    const total = await this.commentsModel.countDocuments(query);
    const comments = await this.commentsModel
      .find(query)
      .sort({ _id: -1 })
      // Chỉ lấy trường name từ category
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const currentPage = page;
    const next = page + 1;
    const prev = page - 1;
    const totalPages = Math.ceil(total / limit);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    return {
      data: comments,
      pages: {
        total,
        currentPage,
        hasNext,
        hasPrev,
        next,
        prev,
      },
    };
  }
  async createComment(
    product_id?: string,
    name?: string,
    email?: string,
    content?: string,
  ): Promise<{
    data: Comments;
    status: string;
  }> {
    const newComment = new this.commentsModel({
      product_id,
      name,
      email,
      content,
    });
    const comment = await newComment.save();
    return {
      data: comment,
      status: 'success',
    };
  }
}
