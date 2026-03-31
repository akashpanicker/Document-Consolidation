export default function SearchInput() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Search Input">
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name=".Search/Default">
        <div className="content-stretch flex items-center pb-[6px] relative shrink-0 w-full" data-name=".Label">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Label">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#b6c2d9] text-[14px] whitespace-nowrap">Weather</p>
          </div>
        </div>
        <div className="bg-[#0e141f] content-stretch flex items-center relative rounded-[4px] shrink-0 w-full" data-name=".Container">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-h-px min-w-px relative" data-name=".Field">
            <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-full" data-name="Container">
              <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full" data-name="Content">
                <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[4px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center px-[12px] relative size-full">
                    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name=".Text">
                      <div className="content-stretch flex items-center relative shrink-0" data-name="Content">
                        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8a9ab6] text-[14px] whitespace-nowrap">
                          <p className="leading-[1.5]">Select Weather</p>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Chevron down">
                      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
                        <div className="absolute inset-[-20%_-10%]">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.6 5.6">
                            <path d="M0.8 0.8L4.8 4.8L8.8 0.8" id="Icon" stroke="var(--stroke-0, #8A9AB6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}