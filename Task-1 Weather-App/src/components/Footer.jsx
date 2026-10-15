
function Footer() {
  return (
    <footer className="footer">
      <p className="footer-title">🌤️ Weather App</p>
      <p>Check the weather of your city.</p>
      <p className="footer-copy">
        © {new Date().getFullYear()} Weather App. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
