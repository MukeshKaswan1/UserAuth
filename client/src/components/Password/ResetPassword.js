import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const port = "http://localhost:5000";
  const [otp, setOtp] = useState({});
  const [pass, setPass] = useState({ password: "", cpassword: "" });
  const localOtp = localStorage.getItem("otp");
  const [isActive, setActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const setval = (e) => {
    const { name, value } = e.target;

    setOtp(() => {
      return {
        ...otp,
        [name]: value,
      };
    });
  };
  const setval2 = (e) => {
    const { name, value } = e.target;
    setPass(() => {
      return {
        ...pass,
        [name]: value,
      };
    });
  };

  const handlesubmit = () => {
    if (localOtp === otp.otp) {
      setActive(true);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    const { password, cpassword } = pass;
    const data = await fetch(`${port}/resetPasword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: location.state?.data, password }),
    });
    const res = await data.json();
    if (res.status == 201) {
      navigate("/");
    }
  };

  return (
    <>
      {!isActive ? (
        <>
          <div
            style={{
              marginTop: "10rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "rgb(255, 153, 178)", 
                width: "30%",
                padding: "5rem 0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: "50%" }}>
                <div
                  style={{
                    width: "100%",
                    padding: ".2rem .3rem",
                    textAlign: "center",
                  }}
                >
                  <h3>Enter Your OTP</h3>
                </div>
                <div
                  className="pass"
                  style={{
                    width: "100%",
                    border: "1px solid black",
                    padding: ".2rem .3rem",
                    borderRadius: "0.3rem",
                    marginBottom: "1rem",
                  }}
                >
                  <input
                    type="string"
                    placeholder="OTP"
                    name="otp"
                    value={otp.otp}
                    onChange={setval}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.3rem",
                    }}
                  />
                </div>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <button
                    style={{
                      background: "black",
                      padding: ".5rem 2rem",
                      color: "white",
                      borderRadius: ".3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={handlesubmit}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              marginTop: "10rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "rgb(255, 153, 178)",
                width: "30%",
                padding: "5rem 0",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: "50%" }}>
                <div
                  style={{
                    width: "100%",
                    padding: ".2rem .3rem",
                    textAlign: "center",
                  }}
                >
                  <h3>Enter New Password</h3>
                </div>
                <div
                  className="pass"
                  style={{
                    width: "100%",
                    padding: ".2rem .3rem",
                    borderRadius: "0.3rem",
                    marginBottom: "1rem",
                  }}
                >
                  <input
                    style={{
                      border: "1px solid black",
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.3rem",
                      marginBottom: "1rem",
                    }}
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={pass.password}
                    onChange={setval2}
                  />
                  <input
                    style={{
                      border: "1px solid black",
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.3rem",
                    }}
                    type="password"
                    placeholder="Confirm Password"
                    name="cpassword"
                    value={pass.cpassword}
                    onChange={setval2}
                  />
                </div>
                <div style={{ width: "100%", textAlign: "center" }}>
                  <button
                    style={{
                      background: "black",
                      padding: ".5rem 2rem",
                      color: "white",
                      borderRadius: ".3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={handlePassword}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResetPassword;
