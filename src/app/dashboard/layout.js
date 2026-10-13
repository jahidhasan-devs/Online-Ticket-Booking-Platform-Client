import DashboardSidebar from '@/components/dashboard/DasboardSidebar'
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
      <DashboardSidebar/>

        <div className="flex-1 overflow-y-auto">
          {/* navbar */}
           {/* <div className="border border-b-1  p-3 w-full ">Navbar</div> */}
          <main className="p-5">
            {children}
            </main>
        </div>
      </div>
    </div>
  );
}
