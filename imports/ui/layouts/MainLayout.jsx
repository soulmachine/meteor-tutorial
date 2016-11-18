import React from 'react';

import Nav from './Nav';
import Footer from './Footer';


function MainLayout(props) {
	return (
      <div>
        <header>
          <Nav />
        </header>
        <main>
          {props.content}
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
}

export default MainLayout;
