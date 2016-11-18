import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../../ui/static/style';

function MainLayout({children}) {
  const activeMenu = FlowRouter.getRouteName();
  return (
    <div className="main-wrapper">
      <Header activeMenu = {activeMenu} />
      {children}
      <Footer />
    </div>
  );
}

export default MainLayout;
