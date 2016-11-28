import React from 'react';
import Helmet from "react-helmet";
import ReactRecaptcha from 'react-recaptcha';
import { Meteor } from 'meteor/meteor';

const RecaptchaItem = React.createClass({
  verifyCallback(result) {
    this.props.onChange(result); // 认证通过时，通知到 form
  },
  render() {
    return (
      <div>
        <Helmet
          script={[
            {
              "src": "https://www.google.com/recaptcha/api.js?hl=zh_CN",
              "type": "text/javascript",
              "async": true,
              "defer": true
            },
          ]}
        />
        <ReactRecaptcha
          render="explicit"
          sitekey={Meteor.settings.public.reCAPTCHASiteKey}
          onloadCallback={() => {}}
          verifyCallback={this.verifyCallback}
        />
      </div>
    );
  }
});

export default RecaptchaItem;

