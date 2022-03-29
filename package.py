#!/usr/bin/python3
from zipfile import ZipFile
from glob import glob
import re

def make_package(filename, manifest_version):
	with ZipFile(filename, 'w') as myzip:
		files = glob("./src/**", recursive=True)
		for file in files:
			arcname = file.replace("./src/", "", 1)
			if (arcname == ""):
				continue

			match = re.match(r"^manifest\.(\d+)\.json$", arcname)
			if match:
				version = int(match[1])

				if version == manifest_version:
					arcname = "manifest.json"
				else:
					continue

			print("[" + filename + "] adding " + file + " as " + arcname)
			myzip.write(file, arcname=arcname)

make_package("borescope.chrome.zip", 3);
make_package("borescope.firefox.zip", 2);