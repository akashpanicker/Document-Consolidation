import { useState } from "react";
import { useTheme } from "../app/components/ThemeContext";
import svgPaths from "./svg-9ccboph6c2";

interface FormProps {
  onNavigate: (path: string) => void;
}

export default function Form({ onNavigate }: FormProps) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onNavigate("/scope");
    }
  };

  const handleSSO = () => {
    onNavigate("/scope");
  };

  return (
    <div className="bg-[var(--bg-card)] content-stretch flex flex-col gap-[15px] items-start px-[49px] py-[41px] relative rounded-[12px] size-full" data-name="Form">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[12px]" style={{ border: "var(--border-default)", boxShadow: "var(--shadow-card)" }} />
      
      {/* Logo and Title */}
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
        <div className="h-[117px] relative shrink-0 w-[168px]" data-name="HP Logo">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
            <div className="absolute inset-[4.82%_3.33%_4.82%_3.39%]" data-name="Vector">
              {theme === "light" ? (
                <img src="/assets/HP logo (light mode).svg" alt="HP Logo" className="absolute block size-full" style={{ objectFit: 'contain' }} />
              ) : (
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 156.707 105.714">
                  <g id="Vector">
                    <path d={svgPaths.p361c2c00} fill="var(--fill-0, white)" />
                    <path clipRule="evenodd" d={svgPaths.p90b3a40} fill="var(--fill-0, white)" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p27007b00} fill="var(--fill-0, white)" fillRule="evenodd" />
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[var(--border-default)] h-px shrink-0 w-[322.4px]" data-name="Container" />
        <div className="h-[19.5px] relative shrink-0 w-[221.338px]" data-name="Text">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
            <p className="absolute left-1/2 -translate-x-1/2 font-['Inter:Bold',sans-serif] font-bold leading-[19.5px] not-italic text-[var(--text-tertiary)] text-[16px] top-[0.6px] tracking-[1.5px] uppercase whitespace-nowrap">Document Consolidation</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSignIn} className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
        {/* Email Field */}
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <div className="h-[16.5px] relative shrink-0 w-full" data-name="Label">
            <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-0 not-italic text-[var(--text-secondary)] text-[14px] top-[0.6px] whitespace-nowrap">Email ID</p>
          </div>
          <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
            <div className="absolute bg-[var(--bg-input)] h-[40px] left-0 rounded-[6px] top-0 w-full" data-name="Text Input">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email ID"
                className="content-stretch flex items-center overflow-clip pl-[36px] pr-[12px] relative rounded-[inherit] size-full bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[14px] w-full"
                style={{
                  color: email ? "var(--text-primary)" : "var(--text-tertiary)",
                }}
              />
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[6px]" style={{ border: "var(--border-input)" }} />
            </div>
            <div className="absolute left-[12px] size-[16px] top-[12px] pointer-events-none" data-name="Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <g id="Icon">
                  <path d={svgPaths.p399eca00} id="Vector" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="h-[16.5px] relative shrink-0 w-full" data-name="Label">
              <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-0 not-italic text-[var(--text-secondary)] text-[14px] top-[0.6px] whitespace-nowrap">Password</p>
            </div>
            <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
              <div className="absolute bg-[var(--bg-input)] h-[40px] left-0 rounded-[6px] top-0 w-full" data-name="Password Input">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="content-stretch flex items-center overflow-clip pl-[36px] pr-[40px] relative rounded-[inherit] size-full bg-transparent border-none outline-none font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[14px] w-full"
                  style={{
                    color: password ? "var(--text-primary)" : "var(--text-tertiary)",
                  }}
                />
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[6px]" style={{ border: "var(--border-input)" }} />
              </div>
              <div className="absolute left-[12px] size-[16px] top-[12px] pointer-events-none" data-name="Icon">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g id="Icon">
                    <path d={svgPaths.p18f7f580} id="Vector" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                    <path d={svgPaths.p4317f80} id="Vector_2" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </g>
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute content-stretch flex flex-col items-start left-[294.4px] size-[16px] top-[12px] cursor-pointer bg-transparent border-none p-0"
                data-name="Button"
              >
                {showPassword ? (
                  <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                    <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
                      <div className="absolute inset-[-7.14%_-5%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6673 10.6658">
                          <path d={svgPaths.pb85f580} id="Vector" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[37.5%]" data-name="Vector">
                      <div className="absolute inset-[-16.67%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
                          <path d={svgPaths.p36446d40} id="Vector" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                    <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
                      <div className="absolute inset-[-7.14%_-5%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6673 10.6658">
                          <path d={svgPaths.pb85f580} id="Vector" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute inset-[37.5%]" data-name="Vector">
                      <div className="absolute inset-[-16.67%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
                          <path d={svgPaths.p36446d40} id="Vector" stroke="var(--text-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
          <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
            <button
              type="button"
              className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] right-0 not-italic text-[var(--color-brand)] text-[12px] text-right top-[2.6px] whitespace-nowrap cursor-pointer bg-transparent border-none hover:underline"
            >
              Forgot credentials?
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
          <button
            type="submit"
            disabled={!isFormValid}
            className="h-[44px] relative rounded-[6px] shrink-0 w-full cursor-pointer border-none transition-all"
            style={{
              backgroundColor: isFormValid ? "var(--color-brand)" : "var(--bg-button-secondary)",
              opacity: isFormValid ? 1 : 0.5,
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
            data-name="Button"
            onMouseEnter={(e) => {
              if (isFormValid) {
                e.currentTarget.style.backgroundColor = "var(--color-brand-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid) {
                e.currentTarget.style.backgroundColor = "var(--color-brand)";
              }
            }}
          >
            <div className="absolute left-[122.49px] size-[14px] top-[15px] pointer-events-none" data-name="Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                <g id="Icon">
                  <path d={svgPaths.p1aca3780} id="Vector" stroke={isFormValid ? "var(--text-on-primary)" : "var(--text-muted)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  <path d={svgPaths.p2b92b800} id="Vector_2" stroke={isFormValid ? "var(--text-on-primary)" : "var(--text-muted)"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                </g>
              </svg>
            </div>
            <p 
              className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[172.49px] not-italic text-[13px] text-center top-[12.85px] tracking-[1px] whitespace-nowrap pointer-events-none"
              style={{ color: isFormValid ? "var(--text-on-primary)" : "var(--text-muted)" }}
            >
              SIGN IN
            </p>
          </button>
          
          <div 
            style={{ backgroundColor: "var(--color-surface-3)" }} 
            className="h-px shrink-0 w-full" 
            data-name="Container" 
          />
          
          <button
            type="button"
            onClick={handleSSO}
            className="bg-[var(--color-brand)] h-[44px] relative rounded-[6px] shrink-0 w-full cursor-pointer border-none transition-all hover:bg-[var(--color-brand-hover)]"
            data-name="Button"
          >
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[calc(50%+0.3px)] not-italic text-[13px] text-center text-[var(--text-on-primary)] top-[12.85px] tracking-[1px] whitespace-nowrap pointer-events-none">Sign in with SSO</p>
          </button>
          
          <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
            <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[161.7px] not-italic text-[var(--text-muted)] text-[12px] text-center top-[-0.2px] whitespace-nowrap">{`H&P Field Operations System`}</p>
          </div>
        </div>
      </form>
    </div>
  );
}