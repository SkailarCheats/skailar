import { cookies } from "next/headers"
import { getServerSideUser } from "@/lib/payload-utils";
import { redirect } from "next/navigation";
import { ReviewTable } from "@/components/review-table";

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