import { IconContext } from "react-icons";

export default function CustomIcon(props) {

    return (
        <>
            <IconContext.Provider value={{ color: props.color, size: props.size }}>
                {props.children}
            </IconContext.Provider>
        </>
    );
}
