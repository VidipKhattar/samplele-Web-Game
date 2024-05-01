import { Link } from "react-router-dom";
function NoSong() {
  return (
    <div className="bg-gradient-to-bl from-blue-400 to-green-500 via-#65a30d animate-gradient-xy min-h-screen lg:flex lg:justify-center lg:items-center  md:flex md:justify-center md:items-center">
      <div className="container mx-auto px-4 text-center">
        <header className="text-6xl font-bold mb-2 text-white">
          samplele
          <Link to="/admin">
            <button>.</button>
          </Link>
        </header>
        <h2 className="text-white text-xl font-bold mb-4">
          listen to the sample and try and guess which rap song samples it.
        </h2>
        <div className="container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0">
          <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-4 rounded-3xl shadow-lg grid grid-cols-1 gap-4 flex flex-col md:flex-row justify-center items-center">
            <h2 className="text-white text-4xl font-bold">
              no song today unfortunately 😭
            </h2>
            <h2 className="text-white text-4xl font-bold">
              try again tomorrow.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoSong;
