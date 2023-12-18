import "./Footer.css";

export default function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1 border-top">
        <div className="col-md-10 d-flex align-items-center">
          <span className="text-muted">
            &copy; 2023 Joonwoo Jang, Geonho Park <br></br>
            web-FrontEnd <strong>v.1.1.0b_20231206</strong>
            <br></br>
            web-backEnd <strong>v.1.1.0b_20231206</strong>
          </span>
        </div>
        <ul className="nav col-md-1 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <a
              className="text-muted"
              href="https://github.com/orgs/WebProject-Babos/repositories"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/github.svg"
                className="bi"
                width="24"
                height="24"
                alt="github-icon"
              />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
