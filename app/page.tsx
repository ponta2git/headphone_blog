import TabContainer from "../src/components/layout/Tab/TabContainer";
import { ExcerptCard } from "../src/components/sections/article/ExcerptCard";
import { getAllPostDatesWithCache } from "../src/infrastructure/CachedInfrastructure";

export default async function Page() {
  const postDates = await getAllPostDatesWithCache();

  return (
    <TabContainer activeTab="new">
      <div className="flex flex-col gap-y-8">
        {postDates.toReversed().map((date) => (
          <ExcerptCard key={date.toISODate()} selfDate={date} />
        ))}
      </div>
    </TabContainer>
  );
}
