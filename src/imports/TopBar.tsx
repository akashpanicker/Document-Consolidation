import svgPaths from "./svg-ioq6ca64fj";

function Logo() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center px-[6px] relative shrink-0" data-name="logo">
      <div className="h-[46px] overflow-clip relative shrink-0 w-[66px]" data-name="HP Logo">
        <div className="absolute inset-[4.82%_3.33%_4.82%_3.39%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.5636 41.5628">
            <g id="Vector">
              <path d={svgPaths.p2d66ee00} fill="var(--fill-0, white)" />
              <path clipRule="evenodd" d={svgPaths.p2a422c00} fill="var(--fill-0, white)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p2c449600} fill="var(--fill-0, white)" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex gap-[8px] items-center mb-[-4px] relative shrink-0" data-name="Title">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-end leading-[0] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">
        <p className="leading-[1.5]">Pre-Job Planning</p>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-center pb-[4px] relative shrink-0" data-name="text">
      <Title />
      <div className="content-stretch flex items-start mb-[-4px] relative shrink-0" data-name="Breadcrumbs">
        <div className="content-stretch flex items-start relative shrink-0" data-name=".Label">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[#b6c2d9] text-[14px] whitespace-nowrap">Site Conditions</p>
        </div>
      </div>
    </div>
  );
}

function LeftContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[20px] h-full items-center min-h-px min-w-px relative" data-name="Left content">
      <Logo />
      <Text />
    </div>
  );
}

function MiddleContent() {
  return <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px" data-name="Middle content" />;
}

function Avatar() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Avatar">
      <div className="relative shrink-0 size-[40px]" data-name="Avatar">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 rounded-[30px] size-[40px] top-1/2" data-name=".Background">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
            <circle cx="20" cy="20" fill="var(--fill-0, #253552)" id="background" r="20" />
          </svg>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[24px] top-1/2" data-name="person">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g id="Frame">
              <path d={svgPaths.p27c6f00} fill="var(--fill-0, #B6C2D9)" id="Vector" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function NameRole() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[0] not-italic relative shrink-0 tracking-[0.15px] whitespace-nowrap" data-name="Name&role">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-end relative shrink-0 text-[#b6c2d9] text-[14px]">
        <p className="leading-none">John Smith</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-end relative shrink-0 text-[#8b98a8] text-[12px]">
        <p className="leading-none">Product Owner</p>
      </div>
    </div>
  );
}

function User() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="user">
      <Avatar />
      <NameRole />
    </div>
  );
}

function RightContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] h-full items-center justify-end min-h-px min-w-px relative" data-name="Right content">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Status Indicator">
        <div className="bg-[#173d2f] content-stretch flex gap-[8px] h-[24px] items-center pl-[12px] pr-[8px] relative rounded-[30px] shrink-0" data-name=".Container">
          <div className="relative shrink-0 size-[8px]" data-name="Dot">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
              <circle cx="4" cy="4" fill="var(--fill-0, #4ED199)" id="Dot" r="4" />
            </svg>
          </div>
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#2fbf71] text-[14px] text-center tracking-[0.15px] whitespace-nowrap">
            <p className="leading-none">Online</p>
          </div>
        </div>
      </div>
      <User />
    </div>
  );
}

export default function TopBar() {
  return (
    <div className="bg-[#121a28] content-stretch flex items-start pl-[16px] pr-[24px] relative size-full" data-name="Top bar">
      <div aria-hidden="true" className="absolute border-[#5f6f8a] border-b border-solid inset-0 pointer-events-none" />
      <LeftContent />
      <MiddleContent />
      <RightContent />
    </div>
  );
}