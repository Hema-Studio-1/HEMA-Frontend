import { useState } from "react";

export function Settings() {
  const [accountData, setAccountData] = useState({
    fullName: "Maria Alvarez",
    email: "maria.alvarez@studio.com",
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [accountSaved, setAccountSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveAccount = () => {
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2000);
  };

  const handleUpdatePassword = () => {
    if (
      securityData.currentPassword &&
      securityData.newPassword &&
      securityData.confirmPassword
    ) {
      setPasswordSaved(true);
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSaved(false), 2000);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[680px]">
        {/* Page Title */}
        <div className="mb-20">
          <h2
            className="text-[32px] tracking-tight text-foreground"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
              letterSpacing: "-0.01em",
            }}
          >
            Settings
          </h2>
        </div>

        {/* Section 1 - Account Information */}
        <section className="mb-20">
          <h3
            className="text-[18px] text-foreground mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
            }}
          >
            Account Information
          </h3>

          <div className="space-y-8">
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                value={accountData.fullName}
                onChange={(e) =>
                  setAccountData({ ...accountData, fullName: e.target.value })
                }
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={accountData.email}
                onChange={(e) =>
                  setAccountData({ ...accountData, email: e.target.value })
                }
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleSaveAccount}
                className="w-fit h-fit px-4 py-3 bg-foreground text-[#FDFCFB] text-[13px] rounded-sm hover:opacity-80 transition-opacity duration-300 "
              >
                Save changes
              </button>
              {accountSaved && (
                <span
                  className="text-[12px] text-[#A4AC96]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Saved
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Section 2 - Security */}
        <section className="mb-20">
          <h3
            className="text-[18px] text-foreground mb-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 300,
            }}
          >
            Security
          </h3>

          <div className="space-y-8">
            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Current Password
              </label>
              <input
                type="password"
                value={securityData.currentPassword}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={securityData.newPassword}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div>
              <label
                className="block text-[11px] text-textSecondary mb-3 uppercase tracking-widest"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.1em",
                }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) =>
                  setSecurityData({
                    ...securityData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
                className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleUpdatePassword}
                className="w-fit h-fit px-4 py-3 bg-foreground text-[#FDFCFB] text-[13px] rounded-sm hover:opacity-80 transition-opacity duration-300 "
              >
                Update password
              </button>
              {passwordSaved && (
                <span
                  className="text-[12px] text-[#A4AC96]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Updated
                </span>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
