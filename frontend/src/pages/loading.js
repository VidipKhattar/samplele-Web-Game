function loading() {
  return (
    <div className="bg-gradient-to-bl from-red-400 to-teal-500 via-#65a30d animate-gradient-xy min-h-screen lg:flex lg:justify-center lg:items-center  md:flex md:justify-center md:items-center">
      <div className="container mx-auto px-4 text-center">
        <header className="text-6xl font-bold mb-2 text-white">
          samplele.
        </header>
        <h2 className="text-white text-xl mb-4">
          listen to the sample and try and guess which rap song samples it.
        </h2>
        <div className="container mx-auto 2xl:px-96 xl:px-64 lg:px-32 md:px-0">
          <div className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg p-8 rounded-3xl shadow-lg grid grid-cols-1 gap-4 flex flex-col md:flex-row justify-center items-center">
            <h2 className="text-white text-4xl font-semibold">loading.</h2>
            <div className="flex items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default loading;
