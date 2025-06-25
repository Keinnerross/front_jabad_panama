export const TouristInfoEntry = ({ data }) => {
    return (
        <section className=" tourist-content">
            <h2 className="text-3xl font-bold text-darkBlue mb-6">
                {data?.title}
            </h2>

            <div className="text-gray-text text-sm leading-relaxed space-y-4 mb-4">

                <div dangerouslySetInnerHTML={{ __html: data?.shortDescription }} />
            </div>

            <div className="w-full h-[330px] overflow-hidden rounded-2xl">
                <div className="w-full h-full bg-red-200" />
            </div>

            <div className="text-gray-text text-sm leading-relaxed space-y-4 mt-4">
                <div dangerouslySetInnerHTML={{ __html: data?.longDescription }} />

            </div>
        </section>
    )
}