import Header from "@/components/Header";
import { Files, File } from "@/types";
import { Button, Page, Tree, useTheme } from "@geist-ui/core";
import { BookOpen } from "@geist-ui/icons";
import { TreeFile } from "@geist-ui/core/esm/tree";
import { useEffect, useState } from "react";

const PanelContent = () => {
	const { palette } = useTheme();

	const [sfFiles, setSfFiles] = useState<Files>();
	const [treeFiles, setTreeFiles] = useState<TreeFile[]>();
	const [selectedFile, setSelectedFile] = useState<File | null>();

	useEffect(() => {
		browser.storage.sync.get("files").then((data) => {
			setSfFiles(data.files as Files);
		});
	}, []);

	useEffect(() => {
		setTreeFiles(
			Object.entries(sfFiles ?? {}).map(([name, directory]) => {
				return {
					type: "directory",
					name: directory.name,
					extra: `${directory.files.length} files`,
					files: directory.files.map((file) => {
						return {
							type: "file",
							name: file.name,
							extra: file.type,
						};
					}),
				};
			})
		);
	}, [sfFiles]);

	const unwatch = storage.watch<Files>("sync:files", (newFiles) => {
		if (!newFiles) return;
		setSfFiles(newFiles);
	});

	const handleFileClick = (file: File) => {
		setSelectedFile(selectedFile?.name === file.name ? null : file);
	};

	const handleBtnClick = () => {
		if (selectedFile) {
			console.log(selectedFile);
		}
	};

	return (
		<Page style={{ backgroundColor: palette.background }} className="!fixed top-0 left-0 !w-full !h-full !py-4">
			<Page.Header>
				<Header colored={true} />
			</Page.Header>

			<Page.Content className="!py-6 max-h-[75vh] overflow-y-scroll">
				<div className="overflow-y-auto">
					<Tree initialExpand={true}>
						{sfFiles &&
							Object.entries(sfFiles).map(([name, directory]) => {
								return (
									<Tree.Folder key={name} name={directory.name} extra={`${directory.files.length} files`}>
										{directory.files?.map((f) => {
											return (
												<Tree.File
													key={f.name}
													name={f.name}
													extra={f.type}
													onClick={() => {
														handleFileClick(f);
													}}
													style={{ paddingInline: ".2rem", position: "relative" }}
													className={
														selectedFile?.name === f.name
															? "after:absolute after:w-full after:h-full after:left-0 after:top-0 after:bg-[--accent-color] after:opacity-15 dark:after:opacity-20 after:rounded-md after:duration-300"
															: ""
													}
												/>
											);
										})}
									</Tree.Folder>
								);
							})}
					</Tree>
				</div>
			</Page.Content>

			<Page.Footer className="left-0">
				<div className="flex items-center justify-end p-6">
					<Button
						icon={<BookOpen />}
						placeholder={undefined}
						onPointerEnterCapture={undefined}
						onPointerLeaveCapture={undefined}
						disabled={!selectedFile}
						type="secondary"
						auto
						onClick={handleBtnClick}
					>
						Open Selected File
					</Button>
				</div>
			</Page.Footer>
		</Page>
	);
};

export default PanelContent;
