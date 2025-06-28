import { ButtonTheme } from "../../ui/common/buttonTheme";
import { CategoryTag } from "../../ui/common/categoryTag";
import { activitiesData } from "@/app/data/activities";

export const ActivitiesSecundarySection = () => {
  const featuredActivity = activitiesData[0]; // posición 0
  const secondaryActivities = activitiesData.slice(1, 4); // posición 1 a 3 (sin incluir la 4)

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-7xl px-4 md:px-0 pb-20 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-darkBlue">
            Your Panama Adventure Continues!
          </h2>
          <ButtonTheme title="Check Details" />
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Featured Card (position 0) */}
          <div className="lg:w-[40%]">
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="h-64 md:h-80 bg-red-300 rounded-xl overflow-hidden">
                {/* Replace with Next.js Image */}
                <div className="w-full h-full object-cover bg-red-300" />
              </div>
              <div className="p-8 space-y-4">
                <CategoryTag categoryTitle={featuredActivity.category} />
                <h3 className="text-2xl font-bold text-darkBlue">
                  {featuredActivity.title}
                </h3>
                <p className="text-gray-text text-sm">
                  {featuredActivity.description}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Cards (position 1-3) */}
          <div className="lg:w-[60%] space-y-6">
            {secondaryActivities.map((activity, i) => (
              <div
                key={activity.id || i}
                className="flex flex-col sm:flex-row rounded-xl overflow-hidden"
              >
                <div className="sm:w-1/3 h-48 bg-red-300 rounded-xl overflow-hidden">
                  {/* Replace with Next.js Image */}
                  <div className="w-full h-full object-cover bg-red-300" />
                </div>

                <div className="sm:w-2/3 bg-white p-6 space-y-4">
                  <CategoryTag categoryTitle={activity.category} />
                  <h3 className="text-xl font-bold text-darkBlue">
                    {activity.title}
                  </h3>
                  <p className="text-gray-text text-sm">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
