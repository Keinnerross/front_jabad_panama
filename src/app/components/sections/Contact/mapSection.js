import { ButtonTheme } from "../../ui/common/buttonTheme"

export const MapSection = () => {

    return (
        <section className="w-full flex justify-center items-center py-20">
            <div className="max-w-7xl w-7xl mx-auto flex flex-col justify-center items-center gap-10 ">
                <h2 className="text-center text-myBlack font-bold text-3xl md:text-4xl">
                    You will find us here
                </h2>

                <div className="flex justify-between w-[70%] text-gray-800 font-medium">
                    <div>
                        <p>Chabad of Panama City</p>
                        <p>9a Calle gil Colunge, Panamá, Panar</p>
                    </div>

                 <ButtonTheme title="Navigate" variation={3}/>

                </div>

                <div className="w-full bg-red-100 rounded-2xl h-[50vh]"></div>

            </div>
        </section>
    )
}