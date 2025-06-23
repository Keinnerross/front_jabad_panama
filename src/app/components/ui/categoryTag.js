export const CategoryTag = ({ icon, categoryTitle = "Category" }) => {
    return (
        <div className="flex items-center gap-2 bg-white rounded-lg border border-solid border-gray-200 px-3 py-1 w-fit ">
            <span className="text-primary">{icon ?? "X"}</span>
            <span className="text-myBlack font-bold text-sm">{categoryTitle}</span>
        </div>
    )
}


