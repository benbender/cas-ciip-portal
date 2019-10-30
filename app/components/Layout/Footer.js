import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <ul>
            <li>
              <a href=".">Home</a>
            </li>
            <li>
              <a href=".">Contact Us</a>
            </li>
          </ul>
        </div>
        <style jsx>
          {`
            footer {
              background-color: #036;
              border-top: 2px solid #fcba19;
              color: #fff;
              font-family: ‘Noto Sans’, Verdana, Arial, sans-serif;
              margin-top: 100px;
            }

            footer .container {
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              height: 46px;
            }

            footer ul {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              margin: 0;
              color: #fff;
              list-style: none;
              align-items: center;
              height: 100%;
            }

            footer ul li a {
              font-size: 0.813em;
              font-weight: normal; /* 400 */
              color: #fff;
              border-right: 1px solid #4b5e7e;
              padding-left: 5px;
              padding-right: 5px;
            }

            a:hover {
              color: #fff;
              text-decoration: underline;
            }

            :focus {
              outline: 4px solid #3b99fc;
              outline-offset: 1px;
            }
          `}
        </style>
      </footer>
    </>
  );
};

export default Footer;
