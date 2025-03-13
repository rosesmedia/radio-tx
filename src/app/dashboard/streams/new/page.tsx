import { prisma } from "@/lib/db";
import { NewStreamForm } from "./form";

export default async function NewIngest() {
    const ingestPoints = await prisma.ingestPoint.findMany();
    return <NewStreamForm ingestPoints={ingestPoints} />
}
