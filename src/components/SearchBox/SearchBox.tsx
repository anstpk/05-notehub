import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox = ({ onChange }: SearchBoxProps) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={onChange}
    />
  );
};

export default SearchBox;