import Link from 'next/link';
import headerStyles from '../styles/components/Header.module.scss';

const NavList = (props) => {
  const linkList = [
    {id: 'top', name: 'Top', url: '/'},
    {id: 'artist', name: 'Artist', url: '/artist'},
    {id: 'tracks', name: 'Tracks', url: '/tracks'},
  ];

  const checkLink = (link) => {
    if (link !== props.currentPage) return false;
    return true;
  }

  return (
    <ul className={headerStyles.nav_lists}>
      {linkList.map((link) => {
        return (
          <li
            key={link.id}
            className={`${headerStyles.nav_list}`}
            data-active={checkLink(`${link.id}`)}>
            <Link href={link.url}>{link.name}</Link>
          </li>
        );
      })}
    </ul>
  );
}

const Header = (props) => {
  return (
    <header>
      <nav className={headerStyles.nav}>
        <div className={headerStyles.nav_container}>
          <h1 className={headerStyles.heading1}>{props.title}</h1>
          <div>
            <NavList currentPage={props.currentPage} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;