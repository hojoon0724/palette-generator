type TabsProps = Readonly<{
  tabs: string[];
  selectedTab: string;
  className?: string;
  onSelectTab: (tab: string) => void;
  children?: React.ReactNode;
}>;

export function Tabs({ tabs, selectedTab, className, onSelectTab, children }: TabsProps) {
  return (
    <div className={`tabs-container flex flex-col items-center w-full ${className}`}>
      <div className="tabs flex gap-x-4 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 -mb-px font-medium ${
              tab === selectedTab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => onSelectTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content-container flex my-4">{children}</div>
    </div>
  );
}
