import React from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';
import Link from 'next/link';
import LoginButton from 'components/LoginButton';

const HeaderLayout = ({isLoggedIn = false, isRegistered = false}) => (
  <header>
    <div className="container full-width">
      <div className="banner">
        <div className="header-left">
          <Link href="/">
            <a>
              <img
                src="/static/BCID_CleanBC_rev_tagline_colour.svg"
                alt="logo for Province of British Columbia CleanBC"
              />
            </a>
          </Link>
          <h1>CleanBC Industrial Incentive Program</h1>
        </div>
        <div className="login-btns header-right">
          <div className="container">
            <Row>
              {isRegistered ? (
                <Col>
                  <Link href="/">
                    <a className="btn btn-outline-light">Dashboard</a>
                  </Link>
                </Col>
              ) : null}
              <div>
                {isLoggedIn ? (
                  <Form.Row>
                    {isRegistered && (
                      <Col>
                        <Link href="/user/profile">
                          <a className="btn btn-outline-light">Profile</a>
                        </Link>
                      </Col>
                    )}
                    <Col>
                      <Form action="/logout" method="post">
                        <Button type="submit" variant="outline-light">
                          Logout
                        </Button>
                      </Form>
                    </Col>
                  </Form.Row>
                ) : (
                  <Form.Row>
                    <Col>
                      <Link href="/register">
                        <a className="btn btn-outline-light">Register</a>
                      </Link>
                    </Col>
                    <Col>
                      <LoginButton type="submit" variant="outline-light">
                        Login
                      </LoginButton>
                    </Col>
                  </Form.Row>
                )}
              </div>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <style jsx>
      {`
        header {
          background-color: #036;
          border-bottom: 2px solid #fcba19;
          padding: 10px 65px;
          color: #fff;
          height: 65px;
          top: 0px;
          width: 100%;
        }
        header h1 {
          font-weight: normal;
          margin: 8px 5px 5px 18px;
        }
        .header-left img {
          height: 46px;
          position: relative;
          top: -4px;
        }
        .header-right {
          margin-right: -25px;
        }
        header .banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 10px 0 0;
        }

        header .other {
          display: flex;
          flex-grow: 1;
          /*  border-style: dotted;
              border-width: 1px;
              border-color: lightgrey; */
        }

        .buttons {
          display: flex;
          flex-grow: 1;
          align-items: center;
          justify-content: flex-end;
        }

        /*
            These are sample media queries only. Media queries are quite subjective
            but, in general, should be made for the three different classes of screen
            size: phone, tablet, full.
          */

        @media screen and (min-width: 900px) {
          header h1 {
            font-size: 1.4em;
            visibility: visible;
          }
        }

        @media (max-width: 899px) {
          header {
            padding: 10px 0 !important;
            margin-bottom: 58px;
          }
          header h1 {
            font-size: calc(6px + 2vw);
            visibility: visible;
            height: 20px;
          }
          .full-width.container {
            max-width: 100%;
            padding: 0;
          }
          .banner {
            flex-flow: wrap;
            margin: 0 !important;
          }
          .header-right {
            background: #004085;
            width: 100%;
            padding: 10px 10px 10px 35px;
            margin: 14px 0;
            z-index: 1;
          }
          .header-left {
            padding: 0 0 0 20px;
          }
        }
      `}
    </style>
  </header>
);

export default HeaderLayout;
