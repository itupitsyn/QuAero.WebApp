import { ImageEditor } from "@/components/ImageEditor";
import { TOKEN } from "@/constants/cookies";
import { getServerSession } from "@/utils/session";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page() {
  const token = cookies().get(TOKEN);
  const session = await getServerSession(token?.value);

  if (!session) {
    return notFound();
  }

  return <ImageEditor />;
}
