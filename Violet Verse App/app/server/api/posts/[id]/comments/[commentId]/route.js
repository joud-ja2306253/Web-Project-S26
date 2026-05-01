import { NextResponse } from "next/server";
import interactionRepo from "../../../../../../repo/InteractionRepository";
export async function PUT(request, { params }) {
    const { commentId } = await params;
    const body = await request.json();

    if (!body.comment || !body.comment.trim()) {
        return NextResponse.json(
            { error: "Comment is required" },
            { status: 400 }
        );
    }

    const updated = await interactionRepo.updateComment(commentId, {
        comment: body.comment
    });

    if (!updated) {
        return NextResponse.json(
            { error: "Comment not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(updated);
}