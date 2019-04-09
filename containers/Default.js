import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

const Default = props => (
  <div>
    <Helmet>
      <title>{props.title !== '' ? props.title : ''}</title>
    </Helmet>
    {props.children}
  </div>
);

Default.propTypes = {
  title: PropTypes.string,
  url: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
};

Default.defaultProps = {
  title: ''
};

export default Default;
