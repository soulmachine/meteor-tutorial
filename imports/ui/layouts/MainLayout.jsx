import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../ui/static/style';

function MainLayout({children}) {
  const activeMenu = FlowRouter.getRouteName();
  return (
    //<div className="page-wrapper">
    <div>
      <Header activeMenu={activeMenu}/>
      <div className="main-wrapper">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
