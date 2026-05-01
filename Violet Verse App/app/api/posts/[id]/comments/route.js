import { NextResponse } from "next/server";
import interactionRepo from "@/repos/InteractionRepository";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const comments = await interactionRepo.getComments(id);

    return NextResponse.json(comments);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}