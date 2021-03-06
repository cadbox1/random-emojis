import { Button, H1 } from "cadells-vanilla-components";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "./messageSlice";
import { randomEmoji } from "./randomEmoji";
import { RootState } from "./store";
import { appClass } from "./styles.css";
import { setupWebsocket, websocketSend } from "./websocketClient";

export function Messages() {
	const messages = useSelector((state: RootState) => state.message.messages);
	const dispatch = useDispatch();
	const containerRef = useRef(null);

	useEffect(() => {
		setupWebsocket();
	}, []);

	useLayoutEffect(() => {
		const container = containerRef.current;

		// https://stackoverflow.com/a/21067431
		const isScrolledToBottom =
			container.scrollHeight - container.clientHeight <=
			container.scrollTop + 60; // not really sure why 60 but it seems to work

		// scroll to bottom if isScrolledToBottom is true or forced
		if (isScrolledToBottom) {
			container.scrollTop = container.scrollHeight - container.clientHeight;
		}
	}, [messages.length]);

	const handleSubmit = evt => {
		evt.preventDefault();
		const action = message({
			value: randomEmoji(),
			timestamp: new Date().toISOString(),
		});
		dispatch(action);
		websocketSend(action);
	};

	return (
		<div className={appClass}>
			<div
				style={{
					height: `350px`,
					width: `50%`,
					overflow: `auto`,
					paddingBottom: "1rem"
				}}
				ref={containerRef}
			>
				{messages.map((message, index) => (
					<p
						key={index}
						title={`${new Date(message.timestamp).toLocaleString()}`}
						style={{ fontSize: `2rem`, margin: `0.5rem 0` }}
					>
						{message.value}
					</p>
				))}
			</div>
			{/*
 				// @ts-ignore */}
			<Button onClick={handleSubmit}>Add Emoji</Button>
		</div>
	);
}
