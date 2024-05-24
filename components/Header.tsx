import { Icon } from "@iconify/react/dist/iconify.js";

type HeaderProps = {
    colored: boolean;
}

const Header = (props: HeaderProps) => {
    return(
        <div className="inline-flex items-center gap-3 z-10">
        <Icon icon="simple-icons:salesforce" className={"text-2xl duration-500 "+(props.colored && "text-[--accent-color]")}/>
        <h1 className="text-2xl tracking-tighter font-semibold">
          <span className="pixelated">D</span>ev&nbsp;&nbsp;
          <span className={"font-bold duration-300 "+(props.colored && "text-[--accent-color]")}>
            <span className="pixelated">O</span>ne
          </span>
        </h1>
      </div>
    );
}

export default Header;