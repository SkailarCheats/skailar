import { ReviewTable } from "@/components/review-table";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ReviewsPage = async () => {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies)

  if (!user || user.role !== 'admin') {
    return redirect('/') // useRouter only works in Client Components
  }

  console.log(user)
  return (
    <ReviewTable />
  )
}

export default ReviewsPage