import React from 'react';

import Header from './Header';
import Footer from './Footer';


function MainLayout(props) {
	return (
    <div>
      <Header />
      {props.content}
      <Footer />
    </div>
  );
}

export default MainLayout;
