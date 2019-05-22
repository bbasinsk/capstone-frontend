import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Header from '../components/header';
import Footer from '../components/footer';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>Terms of Service</title>
      </Helmet>
      <div className="colored-header">
        <Header />
      </div>

      <div className="container">
        <div className="inner-element">
          <h1> Terms of Service </h1>

          <p>
            By using the website, these terms will automatically apply to you –
            you should make sure therefore that you read them carefully before
            using the website. You’re not allowed to copy, or modify the
            website, any part of the website, or our trademarks in any way.
            You’re not allowed to attempt to extract the source code of the
            website, and you also shouldn’t try to translate the website into
            other languages, or make derivative versions. The website itself,
            and all the trade marks, copyright, database rights and other
            intellectual property rights related to it, still belong to
            NeatMeet.
          </p>

          <br />
          <p>
            NeatMeet is committed to ensuring that the website is as useful and
            efficient as possible. For that reason, we reserve the right to make
            changes to the website or to charge for its services, at any time
            and for any reason. We will never charge you for the website or its
            services without making it very clear to you exactly what you’re
            paying for. NeatMeet’s website stores and processes personal data
            that you have provided to us, in order to provide our Service.
            Please note that this includes all meeting-related data, which
            includes but is not limited to: meeting metadata, meeting notes, and
            meeting attendees’ emails. In addition, by using NeatMeet, you also
            agree to receiving emails. The purpose of the emails is also to
            provide our Service.
          </p>

          <br />
          <p>
            It’s your responsibility to keep your phone and access to the
            website secure. We therefore recommend that you do not jailbreak or
            root your phone, which is the process of removing software
            restrictions and limitations imposed by the official operating
            system of your device. It could make your phone vulnerable to
            malware/viruses/malicious programs, compromise your phone’s security
            features and it could mean that the NeatMeet website won’t work
            properly or at all.
          </p>

          <br />
          <p>
            It’s your responsibility to keep your phone and access to the
            website secure. We therefore recommend that you do not jailbreak or
            root your phone, which is the process of removing software
            restrictions and limitations imposed by the official operating
            system of your device. It could make your phone vulnerable to
            malware/viruses/malicious programs, compromise your phone’s security
            features and it could mean that the NeatMeet website won’t work
            properly or at all.
          </p>

          <br />
          <p>
            You should be aware that there are certain things that NeatMeet will
            not take responsibility for. NeatMeet shares meetings via URLs. It
            is not NeatMeet’s responsibility to secure these URLs beyond the
            scope of utilizing HTTPS. Users should understand before using
            NeatMeet that in its current state, anyone with access to the URL
            can gain access to the meeting data, which includes but is not
            limited to: meeting metadata, meeting notes, and meeting attendees’
            emails.
          </p>

          <br />
          <p>
            In connection with your use of the Services, we may send you service
            announcements, administrative messages, and other information. You
            may opt out of some of those communications.
          </p>

          <br />
          <p>
            Certain functions of the website will require the website to have an
            active internet connection. The connection can be Wi-Fi, or provided
            by your mobile network provider, but NeatMeet cannot take
            responsibility for the website not working at full functionality if
            you don’t have access to Wi-Fi, and you don’t have any of your data
            allowance left.
          </p>

          <br />
          <p>
            If you’re using the website outside of an area with Wi-Fi, you
            should remember that your terms of the agreement with your mobile
            network provider will still apply. As a result, you may be charged
            by your mobile provider for the cost of data for the duration of the
            connection while accessing the website, or other third party
            charges. In using the website, you’re accepting responsibility for
            any such charges, including roaming data charges if you use the
            website outside of your home territory (i.e. region or country)
            without turning off data roaming.
          </p>

          <br />
          <p>
            If you are not the bill payer for the device on which you’re using
            the website, please be aware that we assume that you have received
            permission from the bill payer for using the website. Along the same
            lines, NeatMeet cannot always take responsibility for the way you
            use the website i.e. You need to make sure that your device stays
            charged – if it runs out of battery and you can’t turn it on to
            avail the Service, NeatMeet cannot accept responsibility.
          </p>

          <br />
          <p>
            With respect to NeatMeet’s responsibility for your use of the
            website, when you’re using the website, it’s important to bear in
            mind that although we endeavor to ensure that it is updated and
            correct at all times, we do rely on third parties to provide
            information to us so that we can make it available to you. NeatMeet
            accepts no liability for any loss, direct or indirect, you
            experience as a result of relying wholly on this functionality of
            the website.
          </p>

          <h2> Changes to This Terms and Conditions</h2>
          <p>
            We may update our Terms and Conditions from time to time. Thus, you
            are advised to review this page periodically for any changes. We
            will notify you of any changes by posting the new Terms and
            Conditions on this page. These changes are effective immediately
            after they are posted on this page.
          </p>

          <h2> Contact Us </h2>
          <p>
            If you have any questions or suggestions about our Terms and
            Conditions, do not hesitate to contact us. Our current email of
            contact is: josephkt@uw.edu.
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
          // position: absolute;
          // top: 0;
          // bottom: 0;
          // left: 0;
          // right: 0;
          margin: 48px auto;
          // width: 40vw;
          // height: 70vh;
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
