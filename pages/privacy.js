import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Header from '../components/header';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>Privacy Policy</title>
      </Helmet>
      <div className="colored-header">
        <Header />
      </div>

      <div className="container">
        <div className="inner-element">
          <h1> Privacy Policy </h1>

          <p>
            This page is used to inform website visitors regarding our policies
            with the collection, use, and disclosure of Personal Information if
            anyone decided to use our Service. If you choose to use our Service,
            then you agree to the collection and use of information in relation
            to this policy. The Personal Information that we collect is used for
            providing and improving the Service. We will not use or share your
            information with anyone except as described in this Privacy Policy.
            The terms used in this Privacy Policy have the same meanings as in
            our Terms and Conditions, which is accessible at NeatMeet unless
            otherwise defined in this Privacy Policy.
          </p>

          <h2> Information Collection and Use </h2>
          <p>
            For a better experience, while using our Service, we may require you
            to provide us with certain personally identifiable information,
            including but not limited to, email addresses.The information that
            we request is will be retained by us and used as described in this
            privacy policy. The app does use third party services that may
            collect information used to identify you.
          </p>

          <h2> Cookies </h2>
          <p>
            Cookies are files with small amount of data that is commonly used an
            anonymous unique identifier. These are sent to your browser from the
            website that you visit and are stored on your device internal
            memory. This Service does not use these “cookies” explicitly.
            However, the app may use third party code and libraries that use
            “cookies” to collection information and to improve their services.
            You have the option to either accept or refuse these cookies and
            know when a cookie is being sent to your device. If you choose to
            refuse our cookies, you may not be able to use some portions of this
            Service.
          </p>

          <h2> Service Providers </h2>
          <p>
            We may employ third-party companies and individuals due to the
            following reasons:
            <ul>
              <li> To facilitate our Service; </li>
              <li> To provide the Service on our behalf; </li>
              <li> To perform Service-related services; or </li>
              <li> To assist us in analyzing how our Service is used.</li>
            </ul>
            We want to inform users of this Service that these third parties
            have access to your Personal Information. The reason is to perform
            the tasks assigned to them on our behalf. However, they are
            obligated not to disclose or use the information for any other
            purpose.
          </p>

          <h2> Security </h2>
          <p>
            We value your trust in providing us your Personal Information, thus
            we are striving to use commercially acceptable means of protecting
            it. But remember that no method of transmission over the internet,
            or method of electronic storage is 100% secure and reliable, and we
            cannot guarantee its absolute security.
          </p>

          <h2> Links to Other Sites </h2>
          <p>
            This Service may contain links to other sites. If you click on a
            third-party link, you will be directed to that site. Note that these
            external sites are not operated by us. Therefore, we strongly advise
            you to review the Privacy Policy of these websites. We have no
            control over and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
          </p>

          <h2> Children’s Privacy </h2>
          <p>
            These Services do not address anyone under the age of 13. We do not
            knowingly collect personally identifiable information from children
            under 13. In the case we discover that a child under 13 has provided
            us with personal information, we immediately delete this from our
            servers. If you are a parent or guardian and you are aware that your
            child has provided us with personal information, please contact us
            so that we will be able to do necessary actions.
          </p>

          <h2> Changes to this Privacy Policy </h2>
          <p>
            We may update our Privacy Policy from time to time. Thus, you are
            advised to review this page periodically for any changes. We will
            notify you of any changes by posting the new Privacy Policy on this
            page. These changes are effective immediately after they are posted
            on this page.
          </p>

          <h2> Contact Us </h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy,
            do not hesitate to contact us. Our current email of contact is:
            josephkt@uw.edu.
          </p>
        </div>
      </div>

      <style jsx>{`
        h1 {
          color: #2a313e;
          font-size: 32px;
        }

        h2 {
          margin-top: 30px;
        }

        body {
          height: 100vh;
          display: flex;
          font-family: sans-serif;
        }

        container {
          position: relative;
          min-height: 100%;
        }

        .inner-element {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 40vw;
          height: 70vh;
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