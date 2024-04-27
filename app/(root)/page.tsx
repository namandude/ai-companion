import { UserButton } from "@clerk/nextjs"
const Rootpage = () => {
  return (
    <div>
      <UserButton afterSignOutUrl="/"></UserButton>
    </div>
  )
}

export default Rootpage 