#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <pthread.h>
#include <arpa/inet.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <netdb.h>

#include <wiringPi.h>

#define PORT 80
#define ADDRESS "172.217.11.20"
//#define ADDRESS "35.153.107.164"
#define DEPLOYED 1

#define MOTION0_PIN 0
#define MOTION1_PIN 2
#define MOTION2_PIN 3

#define MAXTIMINGS	85
#define DHTP_PIN	12

//#define RELAY_PIN	13

#define DELAY 1000

char* getContentLength(char* response);
int stringToInt(char* text);
char* intToString(int number, int length);
int isStringNumber(char* input);
int getTempAndHumidity();

int main()
{
	struct sockaddr_in serverAddress;
	char *host = "1-dot-cloud-project-iot-mapa.appspot.com";
	struct hostent *server;
	server = gethostbyname(host);

	int serverSocket = socket(AF_INET, SOCK_STREAM, 0);

	serverAddress.sin_port = htons(PORT);
	serverAddress.sin_family = AF_INET;
	//serverAddress.sin_addr.s_addr = inet_addr(ADDRESS);
	//serverAddress.sin_addr.s_addr = server->h_addr;
	memcpy(&serverAddress.sin_addr.s_addr, server->h_addr, server->h_length);

	if (connect(serverSocket, (struct sockaddr*)&serverAddress, sizeof(struct sockaddr)) != 0)
	{
		printf("Error at connect! Line: %d\n", __LINE__);
	}

	if (DEPLOYED)
	{
		///*
		if (wiringPiSetup() == -1)
		{
			return 1;
		}

		pinMode(MOTION0_PIN, INPUT);
		pinMode(MOTION1_PIN, INPUT);
		pinMode(MOTION2_PIN, INPUT);

		//pinMode(RELAY_PIN, OUTPUT);
		//*/
	}

	int temperature = 0;
	int humidity = 0;

	int motion0 = 0;
	int motion1 = 0;
	int motion2 = 0;

	int temperatureChanged = 0;
	int humidityChanged = 0;
	int temperatureDifference = 2;
	int humidityDifference = 2;

	while(1)
	{
		delay(DELAY);

		char* request;
		if (!DEPLOYED)
		{
			request = "POST /senddata HTTP/1.1\r\n"
			"Host: 1-dot-cloud-project-iot-mapa.appspot.com\r\n"
			//"Host: httpbin.org\r\n"
			"Content-Type: application/json\r\n"
			"Client-Key: b3f7bad7-d796-4f46-bec1-17608ea13c65\r\n"
			"Content-Length: 97\r\n\r\n"
			"{\"temperature\":\"60\", \"umidity\":\"25\", \"proximity\":{\"sensor1\":\"0\", \"sensor2\":\"0\", \"sensor3\":\"0\"}}\r\n";
		}
		else
		{
			int motionData0 = digitalRead(MOTION0_PIN);
			int motionData1 = digitalRead(MOTION1_PIN);
			int motionData2 = digitalRead(MOTION2_PIN);

			int tempAndHumidityResult = getTempAndHumidity();
			int temperatureAux = tempAndHumidityResult / 100;
			int humidityAux = tempAndHumidityResult % 100;

			temperatureChanged = 0;
			humidityChanged = 0;

			if (temperatureAux != 0)
			{
				int difference = temperature - temperatureAux;

				if (difference < 0)
				{
					difference *= -1;
				}

				if (difference > temperatureDifference)
				{
					temperatureChanged = 1;
				}

				temperature = temperatureAux;
			}

			if (humidityAux != 0)
			{
				int difference = humidity - humidityAux;

				if (difference < 0)
				{
					difference *= -1;
				}

				if (difference > humidityDifference)
				{
					humidityChanged = 1;
				}

				humidity = humidityAux;
			}

			if (motion0 == motionData0 && motion1 == motionData1 && motion2 == motionData2 && !temperatureChanged && !humidityChanged)
			{
				continue;
			}
			else
			{
				motion0 = motionData0;
				motion1 = motionData1;
				motion2 = motionData2;
			}

		//https://1-dot-cloud-project-iot-mapa.appspot.com/senddata
		//uint requestSize = strlen("POST / HTTP/1.1\r\n"
			uint requestSize = strlen("POST /senddata HTTP/1.1\r\n"
				"Host: 1-dot-cloud-project-iot-mapa.appspot.com\r\n"
				//"Host: https://httpbin.org\r\n"
				"Content-Type: application/json\r\n"
				"Client-Key: b3f7bad7-d796-4f46-bec1-17608ea13c65\r\n"
				"Content-Length: 97\r\n\r\n");
				//"\r\n");

			request = (char*) malloc(sizeof(char) * requestSize);

		//strcpy(request, "POST / HTTP/1.1\r\n"
			strcpy(request, "POST /senddata HTTP/1.1\r\n"
				"Host: 1-dot-cloud-project-iot-mapa.appspot.com\r\n"
				//"Host: https://httpbin.org\r\n"
				"Content-Type: application/json\r\n"
				"Client-Key: b3f7bad7-d796-4f46-bec1-17608ea13c65\r\n"
				"Content-Length: 97\r\n\r\n");
				//"\r\n");

			char* requestBody = (char*)calloc(sizeof(char), 97);

			strcpy(requestBody, "{\"temperature\":\"");
			strcat(requestBody, intToString(temperature, 2));

			strcat(requestBody, "\", \"umidity\":\"");
			strcat(requestBody, intToString(humidity, 2));

			strcat(requestBody, "\", \"proximity\":");

			strcat(requestBody, "{\"sensor1\":\"");
			strcat(requestBody, intToString(motionData0, 1));

			strcat(requestBody, "\", \"sensor2\":\"");
			strcat(requestBody, intToString(motionData1, 1));

			strcat(requestBody, "\", \"sensor3\":\"");
			strcat(requestBody, intToString(motionData2, 1));
			strcat(requestBody, "\"}}");

			strcat(requestBody, "\r\n");

			request = (char*) realloc(request, requestSize + strlen(requestBody));
			strcat(request, requestBody);

			free(requestBody);
		}

		printf("Request:\n%s", request);

		write(serverSocket, request, strlen(request));

		//free(request);

		char* response = (char*)malloc(sizeof(char) * 100);
		uint block = 100;
		uint size = 100;
		uint responseIndex = 0;

		char c;
		uint counter = 0;

		while(read(serverSocket, &c, 1) != -1)
		{
			response[responseIndex] = c;
			responseIndex++;

			if (responseIndex > size * 0.8)
			{
				size += block;
				response = (char*)realloc(response, sizeof(char) * size);
			}

			if (c == '\r' || c == '\n')
			{
				counter++;
			}
			else
			{
				counter = 0;
			}

			if (counter == 4)
			{
				break;
			}
		}

		printf("Response %s\n", response);

		char* contentLenthString = getContentLength(response);

		if (contentLenthString == NULL)
		{
			continue;
		}

		if (strlen(response) > 0)
		{
			free(response);
		}

		// if (contentLenthString == NULL)
		// {
		// 	return 1;
		// }
		int contentLenth = stringToInt(contentLenthString);
		printf("Content length = %d\n", contentLenth);

		if (contentLenth == 0)
		{
			continue;
		}

		int sizeOfBody = 1;
		char* body = (char*) calloc(sizeof(char), sizeOfBody);

		for (int i = 0; i < contentLenth; i++)
		{
			sizeOfBody++;
			body = (char*) realloc(body, sizeof(char) * sizeOfBody);

			char aux[2];
			aux[1] = '\0';
			read(serverSocket, &aux[0], 1);

			strcat(body, aux);
		}
		strcat(body, "\0");

		printf("Body: %s\n", body);
		free(body);
	}

	return 0;
}

char* getContentLength(char* response)
{
	for (int i = 0; i < strlen(response); i++)
	{
		if (response[i] == ':' && response[i + 1] == ' ')
		{
			int size = 1;
			char* possibleNumber = (char*) calloc(sizeof(char), size);
			i += 2;

			while(response[i] != '\r' && response[i] != '\n' && response[i] != '\0')
			{
				size++;
				possibleNumber = (char*)realloc(possibleNumber, sizeof(char) * size);

				if (possibleNumber == NULL)
				{
					break;
				}

				char aux[2];
				aux[0] = response[i];
				aux[1] = '\0';

				strcat(possibleNumber, aux);

				if (i < strlen(response) - 1)
				{
					i++;
				}
				else
				{
					break;
				}
			}

			strcat(possibleNumber, "\0");

			if (isStringNumber(possibleNumber))
			{
				return possibleNumber;
			}
			else
			{
				free(possibleNumber);
			}
		}
	}
	return NULL;
}

int isStringNumber(char* input)
{
	for (int i = 0; i < strlen(input); i++)
	{
		if (((int)input[i] - 48) < 0 || ((int)input[i] - 48) > 9)
		{
			if (input[i] != '\0')
			{
				return 0;
			}
		}
	}
	return 1;
}

int stringToInt(char* text)
{
	int number = 0;

	if (text[0] == '-')
	{
		return -1;
	}

	for (int i = 0; i < strlen(text); i++)
	{
		number *= 10;
		number += ((int)text[i] - 48);
	}
	return number;
}

char* intToString(int number, int length)
{
	char* result;
	char* reversedResult;
	int size = 1;

	reversedResult = (char*) calloc(sizeof(char), size);

	if (number == 0)
	{
		if (length == 1)
		{
			result = (char*) calloc(sizeof(char), 2);
			strcpy(result, "0\0");
		}
		else if (length == 2)
		{
			result = (char*) calloc(sizeof(char), 3);
			strcpy(result, " 0\0");
		}

		return result;
	}

	if (number < 10 && number >= 0)
	{
		if (length == 1)
		{
			result = (char*) calloc(sizeof(char), 2);
			char digit[2];
			digit[0] = (char)(number + 48);
			digit[1] = '\0';
			strcpy(result, digit);	
		}
		else if (length == 2)
		{
			result = (char*) calloc(sizeof(char), 3);
			char digit[3];
			digit[0] = ' ';
			digit[1] = (char)(number + 48);
			digit[2] = '\0';
			strcpy(result, digit);
		}

		return result;
	}

	while(number > 0)
	{
		size++;
		reversedResult = (char*) realloc(reversedResult, sizeof(char) * size);
		char aux[2];
		aux[0] = (char)((number % 10) + 48);
		aux[1] = '\0';
		strcat(reversedResult, aux);

		number /= 10;
	}

	result = (char*) calloc(sizeof(char), strlen(reversedResult));

	for (int i = 0; i < strlen(reversedResult); i++)
	{
		char aux[2];
		aux[0] = reversedResult[strlen(reversedResult) - i - 1];
		aux[1] = '\0';
		strcat(result, aux);
	}

	free(reversedResult);

	//strcat(result, "\0");
	return result;
}


int getTempAndHumidity()
{
	int dht11_dat[5] = { 0, 0, 0, 0, 0 };

	uint8_t laststate	= HIGH;
	uint8_t counter		= 0;
	uint8_t j		= 0, i;
	float	f; 

	dht11_dat[0] = dht11_dat[1] = dht11_dat[2] = dht11_dat[3] = dht11_dat[4] = 0;

	pinMode( DHTP_PIN, OUTPUT );
	digitalWrite( DHTP_PIN, LOW );
	delay( 18 );
	digitalWrite( DHTP_PIN, HIGH );
	delayMicroseconds( 40 );
	pinMode( DHTP_PIN, INPUT );

	int result = 0;

	for ( i = 0; i < MAXTIMINGS; i++ )
	{
		counter = 0;
		while ( digitalRead( DHTP_PIN ) == laststate )
		{
			counter++;
			delayMicroseconds( 1 );
			if ( counter == 255 )
			{
				break;
			}
		}
		laststate = digitalRead( DHTP_PIN );

		if ( counter == 255 )
			break;

		if ( (i >= 4) && (i % 2 == 0) )
		{
			dht11_dat[j / 8] <<= 1;
			if ( counter > 50 )
			{
				dht11_dat[j / 8] |= 1;
			}

			j++;
		}
	}

	if ( (j >= 40) && (dht11_dat[4] == ( (dht11_dat[0] + dht11_dat[1] + dht11_dat[2] + dht11_dat[3]) & 0xFF) ) )
	{
		f = dht11_dat[2] * 9. / 5. + 32;
		//printf( "Humidity = %d.%d %% Temperature = %d.%d C (%.1f F)\n", dht11_dat[0], dht11_dat[1], dht11_dat[2], dht11_dat[3], f );
		result = dht11_dat[0] * 100;
		result += dht11_dat[2];
	}
	else 
	{
		printf( "Data not good, skip\n" );
	}
	return result;
}
