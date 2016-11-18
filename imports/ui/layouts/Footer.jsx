import React from 'react';

function Footer() {
  return (
    <footer id="footer">
      <ul>
        <li>
          <h2>GitHub</h2>
          <div>
            <a target="_blank " href="https://github.com/soulmachine">
              仓库
            </a>
          </div>
        </li>
        <li>
          <h2>相关站点</h2>
          <div>
            <a href="http://mobile.ant.design">Ant Design Mobile</a>
            <span> - </span>
            移动版
          </div>
          <div>
            <a href="https://g2.alipay.com/">G2</a>
            <span> - </span>
            数据可视化
          </div>
        </li>
        <li>
          <h2>社区</h2>
          <div>
            <a target="_blank" rel="noopener noreferrer" href="/changelog">
              更新记录
            </a>
          </div>
          <div>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/ant-design/ant-design/issues">
              反馈和建议
            </a>
          </div>
        </li>
        <li>
          <div>©2016 蚂蚁金服体验技术部出品</div>
          <div>Powered by <a href="https://github.com/soulmachine">BiSheng</a></div>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
