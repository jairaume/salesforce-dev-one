import Header from "@/components/Header";
import { Files } from "@/types";
import { Button, Page, Tree, useTheme } from "@geist-ui/core";
import { BookOpen } from "@geist-ui/icons";
import { TreeFile } from "@geist-ui/core/esm/tree";
import { useEffect, useState } from "react";

const files: TreeFile[] = [
	{
		type: "directory",
		name: "controllers",
		extra: "1 file",
		files: [
			{
				type: "file",
				name: "cs.js",
				extra: "1kb",
			},
		],
	},
	{
		type: "directory",
		name: "docs",
		extra: "2 files",
		files: [
			{
				type: "file",
				name: "controllers.md",
				extra: "2.5kb",
			},
			{
				type: "file",
				name: "es6.md",
				extra: "2.9kb",
			},
		],
	},
	{
		type: "file",
		name: "production.md",
		extra: "0.8kb",
	},
	{
		type: "file",
		name: "views.md",
		extra: "8.1kb",
	},
];

const PanelContent = () => {
	const { palette } = useTheme();

	const [sfFiles, setSfFiles] = useState<Files>();
	const [treeFiles, setTreeFiles] = useState<TreeFile[]>(files as TreeFile[]);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);

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

	const handleFileClick = (name: string) => {
		setSelectedFile(selectedFile === name ? null : name);
	};

	const handleBtnClick = () => {
		console.log(selectedFile);
    if (selectedFile) {
      const selectedFilePath = sfFiles[selectedFile]?.path;
      if (selectedFilePath) {
        window.location.href = selectedFilePath;
      }
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
						{treeFiles.map((file) => {
							return (
								<Tree.Folder key={file.name} name={file.name} extra={file.extra}>
									{file.files?.map((f) => {
										return (
											<Tree.File
												key={f.name}
												name={f.name}
												extra={f.extra}
												onClick={() => {
													handleFileClick(f.name);
												}}
												style={{ paddingInline: ".2rem", position: "relative" }}
												className={
													selectedFile === f.name
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
						icon={<BookOpen/>}
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
