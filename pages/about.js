import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Header from '../components/header';
import Footer from '../components/footer';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <div className="colored-header">
        <Header />
      </div>

      <div className="container">
        <div className="inner-element">
          <h1> About Us</h1>
          <h2>Our Mission</h2>
          <p>Enable users to collaborate effectively, today.</p>

          <h2>The Problem</h2>
          <p>
            We’ve all been in meetings where we feel like they could have gone a
            little better, or meetings where we felt were just a plain waste of
            our time. We want to collaborate effectively with our team members,
            because that’s where work is fun and progress is made.
          </p>

          <p>
            So how do we do that? And how do we do that, without drastically
            changing the way that people conduct their meetings?
          </p>

          <h2>Meet the Team</h2>

          <p>That’s where our team comes in. </p>

          <p>
            We’re a team of four students from the University of Washington
            Informatics Program studying a variety of subjects such as
            cybersecurity, data science, information architecture, human
            computer interaction, UX, web development, ethics and policy, and
            internet of things (IoT).
          </p>

          <p>
            In each of those focuses, we’ve realized as a team that no matter
            what field you study or specialize in, that you are going to have
            some sort of team collaboration- most commonly known as “meetings”.
            We wanted to tackle this everyday occurrence known as “meetings”,
            and help make each meeting a more valuable experience for everyone
            involved.
          </p>

          <p>
            That is the goal of this student Capstone project. That’s what
            NeatMeet is all about.
          </p>

          <h2>Contact Us</h2>
          <p>
            We’d love to hear from you! Feel free to reach out to us using the
            following contact information:
          </p>

          <p>
            Kari Nasu (UX/UI Designer): kari@neatmeet.co <br />
            Ben Basinski (Web Developer): ben@neatmeet.co <br />
            McKaulay Kolakowski (Web Developer): mckaulay@neatmeet.co <br />
            Joseph Tsai (Project Manager): joseph@neatmeet.co <br />
            General Feedback or Questions: contact@neatmeet.co
          </p>

          <p>
            Please note that as NeatMeet is a student capstone project that it
            will not be actively worked on, but still kept alive for usage.
          </p>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        h2 {
          margin-top: 30px;
        }

        body {
          // height: 100vh;
          display: flex;
          font-family: sans-serif;
        }

        container {
          position: relative;
          min-height: 100%;
        }

        .inner-element {
          max-width: 1152px;
          padding: 32px 24px;
          margin: 48px auto;
          line-height: 30px;
        }

        .inner-element p {
          color: #2a313e;
          font-size: 16px;
        }

        .colored-header {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  ))
);
