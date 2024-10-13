import AllPosts from "./AllPosts"
import logo from '../assets/the folktales.png'

const Home = () => {
  return (
    <div className="">
      <div className="bg-slate-950 grid place-content-center my-10 py-20 max-sm:p-4">
        <img src={logo} alt="" />
      </div>
      <AllPosts />
    </div>
  )
}

export default Home
