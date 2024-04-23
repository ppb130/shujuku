import React, { useState } from "react";
import axios from "axios";
import "./LoginRegister.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [existed, setExisted] = useState(false);
  const [form, setForm] = useState({ username: "", userpwd: "" });

  const changeType = () => {
    setIsLogin(!isLogin);
    setForm({ username: "", userpwd: "" });
  };

  const login = () => {
    if (form.username !== "" && form.userpwd !== "") {
      axios
        .post("http://localhost:3100/login", {
          username: form.username,
          password: form.userpwd,
        })
        .then((res) => {
          console.log("datadata:", res.data);
          if (res.data.status == "0") {
            alert("登录成功！");
            // 设置 cookie，有效期为 1 天
            Cookies.set('user_identity', res.data.user.identity, { expires: 1 });
            Cookies.set('username', res.data.user.username, { expires: 1 });
            if (res.data.user.identity == "admin") {
              navigate("/adminBook");
            } else if (res.data.user.identity == "user") {
              navigate("/userBook");
            }
          } else if (res.data == "-1") {
            setUsernameError(true);
          } else if (res.data == "1") {
            setPasswordError(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("填写不能为空！");
    }
  };
  

  const register = () => {
    if (form.username !== "" && form.userpwd !== "" && form.identity !== "") {
      axios
        .post("http://127.0.0.1:3100/add", {
          username: form.username,
          password: form.userpwd,
          identity: form.identity,
        })
        .then((res) => {
          switch (res.data) {
            case 0:
              alert("注册成功！");
              // login();
              break;
            case -1:
              setExisted(true);
              break;
            default:
              break;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("请填写完整！");
    }
  };
  

  return (
    <div className="login-register">
      <div className="contain">
        <div className={`big-box ${isLogin ? "active" : ""}`}>
          {isLogin ? (
            <div className="big-contain">
              <div className="btitle">账户登录</div>
              <div className="bform">
                <input
                  type="text"
                  placeholder="用户名"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                {usernameError && (
                  <span className="errTips">* 用户名填写错误 *</span>
                )}
                <input
                  type="password"
                  placeholder="密码"
                  value={form.userpwd}
                  onChange={(e) =>
                    setForm({ ...form, userpwd: e.target.value })
                  }
                />
                {passwordError && (
                  <span className="errTips">* 密码填写错误 *</span>
                )}
              </div>
              <button className="bbutton" onClick={login}>
                登录
              </button>
            </div>
          ) : (
            <div className="big-contain">
              <div className="btitle">创建账户</div>
              <div className="bform">
                <input
                  type="text"
                  placeholder="用户名"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
                {existed && (
                  <span className="errTips">* 用户名已经存在！ *</span>
                )}
                <input
                  type="password"
                  placeholder="密码"
                  value={form.userpwd}
                  onChange={(e) =>
                    setForm({ ...form, userpwd: e.target.value })
                  }
                />
                <select
                  value={form.identity}
                  onChange={(e) =>
                    setForm({ ...form, identity: e.target.value })
                  }
                >
                  <option value="">选择身份</option>
                  <option value="user">用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <button className="bbutton" onClick={register}>
                注册
              </button>
            </div>
          )}
        </div>
        <div className={`small-box ${isLogin ? "active" : ""}`}>
          {isLogin ? (
            <div className="small-contain">
              <div className="stitle">你好，朋友！</div>
              <p className="scontent">开始注册，开启任务小助手~</p>
              <button className="sbutton" onClick={changeType}>
                注册
              </button>
            </div>
          ) : (
            <div className="small-contain">
              <div className="stitle">欢迎!</div>
              <p className="scontent">请登录你的账户</p>
              <button className="sbutton" onClick={changeType}>
                登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
