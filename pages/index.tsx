import Layout from "../components/layout"
import { useRouter } from 'next/router';

export default function IndexPage() {

  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/protected');
  };

  return (
    <Layout>
      <div
        className="hero min-h-screen"
        >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Welcome to BoostDAO</h1>
            <p className="mb-5">
            At BoostDAO, we believe in the power of collective decision-making and community support. 
            Our decentralized crowdfunding platform harnesses the strength of blockchain technology to bring your projects to life. 
            Whether you're an entrepreneur seeking funding or a backer passionate about transformative ideas, BoostDAO connects you 
            with opportunities that matter.
            </p>
            <ul>
              <li>Create Campaigns: Launch your projects with transparency and community backing.</li>
              <li>Contribute and Vote: Support initiatives and have a say in the project’s success.</li>
              <li>Secure and Transparent: Experience a new level of trust with blockchain-backed operations.</li>
              <li>Join us in shaping the future of innovation. Together, we’re making great ideas a reality.</li>
            </ul>
            <button className="btn btn-primary py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition" onClick={handleButtonClick}>Get Started</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
