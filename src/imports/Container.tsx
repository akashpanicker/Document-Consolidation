import svgPaths from "./svg-n0t5roau72";

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 whitespace-nowrap">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[24px] relative shrink-0 text-[#e7ecf5] text-[20px]">Morning Site Conditions</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#b6c2d9] text-[14px]">Rig 145 — Midland, TX — MON 16 MAR 2026</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 2V4" id="Vector" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4.93 4.93L6.34 6.34" id="Vector_2" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M20 12H22" id="Vector_3" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M19.07 4.93L17.66 6.34" id="Vector_4" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p136fbe40} id="Vector_5" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p272a0af0} id="Vector_6" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[24px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] h-full items-center relative">
        <Icon />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[#e7ecf5] text-[16px] tracking-[1px] uppercase whitespace-nowrap">Rig Weather Conditions</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[13px] size-[12px] top-[11.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p2023d200} id="Vector" stroke="var(--stroke-0, #B6C2D9)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p2d617c80} id="Vector_2" stroke="var(--stroke-0, #B6C2D9)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[35px] relative rounded-[6px] shrink-0 w-[191.797px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#2b5597] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-[105.5px] not-italic text-[#b6c2d9] text-[14px] text-center top-[7px] whitespace-nowrap">Auto-detect from GPS</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[35px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Button />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#b6c2d9] text-[14px] uppercase whitespace-nowrap">Weather</p>
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Content">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8a9ab6] text-[14px] whitespace-nowrap">
        <p className="leading-[1.5]">Select Weather</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full" data-name="Content">
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] relative size-full">
          <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name=".Text">
            <Content1 />
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
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Content />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#b6c2d9] text-[14px] uppercase whitespace-nowrap">Site Condition</p>
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Content">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8a9ab6] text-[14px] whitespace-nowrap">
        <p className="leading-[1.5]">Select Site Condition</p>
      </div>
    </div>
  );
}

function Content2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full" data-name="Content">
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] relative size-full">
          <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name=".Text">
            <Content3 />
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
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Content2 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.5] not-italic relative shrink-0 text-[#b6c2d9] text-[14px] uppercase whitespace-nowrap">New Crew Member on Shift?</p>
    </div>
  );
}

function Container7() {
  return <div className="bg-white h-[18px] rounded-[9px] shrink-0 w-full" data-name="Container" />;
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Label3 />
      <div className="bg-[#2b5597] content-stretch flex flex-col h-[24px] items-start pb-px pl-[23px] pr-[3px] pt-[3px] relative rounded-[12px] shrink-0 w-[44px]" data-name="Toggle Button">
        <Container7 />
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex items-center pb-[6px] relative shrink-0 w-full" data-name=".Label">
      <Frame1 />
    </div>
  );
}

function Content5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Content">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8a9ab6] text-[14px] whitespace-nowrap">
        <p className="leading-[1.5]">E.g. D. Harris - Floorman (Day 1)</p>
      </div>
    </div>
  );
}

function Content4() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full" data-name="Content">
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] relative size-full">
          <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative" data-name=".Text">
            <Content5 />
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
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start relative shrink-0 w-full" data-name="Container">
      <Content4 />
    </div>
  );
}

function SearchDefault() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name=".Search/Default">
      <Label2 />
      <div className="bg-[#0e141f] content-stretch flex items-center relative rounded-[4px] shrink-0 w-full" data-name=".Container">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-h-px min-w-px relative" data-name=".Field">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function SearchInput() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Search Input">
      <SearchDefault />
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Input">
      <SearchInput />
    </div>
  );
}

function Label4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#b6c2d9] text-[14px] top-0 tracking-[1px] uppercase whitespace-nowrap">Input Plan</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-[#0e141f] h-[96px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[12px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#8a9ab6] text-[14px] w-[518px]">{`Describe today's planned work — e.g. Running 9-5/8 casing, making up connections on rig floor, circulating mud system...`}</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label4 />
      <TextArea />
    </div>
  );
}

function Label5() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Label">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-0 not-italic text-[#b6c2d9] text-[14px] top-0 tracking-[1px] uppercase whitespace-nowrap">Additional Site Hazards (Optional)</p>
    </div>
  );
}

function TextArea1() {
  return (
    <div className="bg-[#0e141f] h-[96px] relative rounded-[6px] shrink-0 w-full" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[12px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#8a9ab6] text-[14px] whitespace-nowrap">E.g. wet surfaces from overnight rain, high UV index, construction near rig floor...</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Container">
      <Label5 />
      <TextArea1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Input">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Search Input">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name=".Search/Default">
            <div className="content-stretch flex items-center pb-[6px] relative shrink-0 w-full" data-name=".Label">
              <Label />
            </div>
            <div className="content-stretch flex items-center relative rounded-[4px] shrink-0 w-full" data-name=".Container">
              <div className="bg-[#0e141f] content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-h-px min-w-px relative rounded-[4px]" data-name=".Field">
                <Container5 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Input">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Search Input">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name=".Search/Default">
            <div className="content-stretch flex items-center pb-[6px] relative shrink-0 w-full" data-name=".Label">
              <Label1 />
            </div>
            <div className="content-stretch flex items-center relative rounded-[4px] shrink-0 w-full" data-name=".Container">
              <div className="bg-[#0e141f] content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-h-px min-w-px relative rounded-[4px]" data-name=".Field">
                <Container6 />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Input />
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#121a28] relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[24px] relative w-full">
        <Container2 />
        <Container4 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[17px] size-[16px] top-[15px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_33_1456)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 10.6667V8" id="Vector_2" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 5.33333H8.00667" id="Vector_3" stroke="var(--stroke-0, #6F8FD9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_33_1456">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[42px] left-[45px] top-[13px] w-[530px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[#b6c2d9] text-[14px] top-0 w-[520px]">AI will generate role-specific safety instructions based on the weather and site conditions you enter above.</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-[#121a28] h-[68px] relative rounded-[6px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#253552] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Icon2 />
      <Text />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-0 size-[14px] top-[3.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p2c0cbc0} id="Vector" stroke="var(--stroke-0, #B6C2D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.0833 7H2.91667" id="Vector_2" stroke="var(--stroke-0, #B6C2D9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Text">
      <Icon3 />
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[39px] not-italic text-[#b6c2d9] text-[14px] text-center top-0 whitespace-nowrap">Back</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#253552] h-[39px] relative rounded-[6px] shrink-0 w-[89.406px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#143269] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[9px] px-[17px] relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[16px] size-[14px] top-[11.5px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_33_1477)" id="Icon">
          <path d={svgPaths.p115b3700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.6667 1.75V4.08333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.8333 2.91667H10.5" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.33333 9.91667V11.0833" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.91667 10.5H1.75" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_33_1477">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#2b5597] h-[37px] relative rounded-[6px] shrink-0 w-[238.078px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon4 />
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[130px] not-italic text-[14px] text-center text-white top-[8px] whitespace-nowrap">Generate Safety Briefing →</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex gap-[12px] h-[39px] items-center justify-end relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative size-full" data-name="Container">
      <Frame />
      <Container1 />
      <Container11 />
      <Container12 />
    </div>
  );
}