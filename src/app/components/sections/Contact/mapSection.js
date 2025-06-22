export const MapSection = () => {

    return (
        <section className="w-full flex justify-center items-center py-20">
            <div className="max-w-7xl w-7xl mx-auto flex flex-col justify-center items-center gap-10 ">
                <h2>You will find us here</h2>

                <div className="flex justify-between w-[70%]">
                    <div>
                        <p>Chabad Panama</p>
                        <p>Calle 123</p>
                    </div>

                    <button className="bg-primary text-white px-6 py-2 ">
                        Navigate
                    </button>

                </div>

                <div className="w-full bg-red-100 rounded-2xl h-[50vh]"></div>

            </div>
        </section>
    )
}