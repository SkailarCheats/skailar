import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';

interface Key {
	id: string;
	key: string;
	expires: string;
	status: string;
	level: string;
	genby: string;
	gendate: string;
}

interface DownloadButtonsProps {
	filteredKeys: Key[];
}

const getExpirationFolder = (timestamp: string): string => {
	const seconds = parseInt(timestamp, 10);
	const oneDay = 86400;
	const threeDays = 3 * oneDay;
	const sevenDays = 7 * oneDay;
	const thirtyDays = 30 * oneDay;

	if (seconds <= oneDay) {
		return '1d';
	} else if (seconds <= threeDays) {
		return '3d';
	} else if (seconds <= sevenDays) {
		return '7d';
	} else if (seconds <= thirtyDays) {
		return '30d';
	} else {
		return 'unknown';
	}
};

const handleDownload = async (keys: Key[], fileType: 'txt' | 'json') => {
	const zip = new JSZip();
	const folder = zip.folder('licenses');
	if (!folder) return;

	const gameFolders: { [key: string]: string } = {
		'1': 'Rainbow/Lite',
		'2': 'Rust',
		'3': 'Fortnite',
		'4': 'Apex',
		'5': 'Valorant',
		'6': 'CS',
		'7': 'Rainbow/Full'
	};

	const groupedKeys: { [path: string]: Key[] } = {};

	keys.forEach(key => {
		if (key.genby === 'SkailarResell' && key.status === 'Not Used') {
			const expirationFolder = getExpirationFolder(key.expires);
			const gameFolder = gameFolders[key.level];
			const filePath = `${gameFolder}/${expirationFolder}`;

			if (!groupedKeys[filePath]) {
				groupedKeys[filePath] = [];
			}
			groupedKeys[filePath].push(key);
		}
	});

	Object.keys(groupedKeys).forEach(filePath => {
		const subfolder = folder.folder(filePath);
		if (subfolder) {
			const content = fileType === 'txt'
				? groupedKeys[filePath].map(key => key.key).join('\n')
				: JSON.stringify(groupedKeys[filePath], null, 2);
			const blob = new Blob([content], { type: fileType === 'txt' ? 'text/plain;charset=utf-8' : 'application/json;charset=utf-8' });
			subfolder.file(`licenses.${fileType}`, blob);
		}
	});

	const content = await zip.generateAsync({ type: 'blob' });
	saveAs(content, 'licenses.zip');
};

const DownloadButtons: React.FC<DownloadButtonsProps> = ({ filteredKeys }) => {
	const keysToDownload = filteredKeys.filter(key => key.status === 'Not Used' && key.genby === 'SkailarResell');

	const handleDownloadTxt = () => handleDownload(keysToDownload, 'txt');
	const handleDownloadJson = () => handleDownload(keysToDownload, 'json');

	return (
		<div className="flex flex-col items-end space-y-2">
			<p className="text-sm font-semibold">Download Reseller Keys (Only for Billgang)</p>
			<div className="flex space-x-2">
				<Button variant="outline" size="sm" className="mr-2" onClick={handleDownloadTxt}>Download TXT</Button>
				<Button variant="outline" size="sm" onClick={handleDownloadJson}>Download JSON</Button>
			</div>
		</div>
	);
};

export default DownloadButtons;
